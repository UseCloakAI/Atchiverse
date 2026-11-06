#!/usr/bin/env python3
"""Build the history-video maps from real geographic data.

Sources (both public domain):
  - Natural Earth I shaded relief + land cover raster (NE1_HR_LC_SR_W.tif, 1/60 degree per pixel)
    https://naciscdn.org/naturalearth/10m/raster/NE1_HR_LC_SR_W.zip
  - Natural Earth 10m vectors: land, rivers + lake centerlines, lakes
    https://github.com/nvkelso/natural-earth-vector/tree/master/geojson

Usage: python3 tools/build_maps.py <data-dir>
Writes assets/maps/<name>.jpg (720x1280 portrait) and src/maps.js (overlay paths in the 360x640 scene space).
Projection: equirectangular crop around each map's center, with the longitude span widened by 1/cos(lat)
so shapes are not squashed (same as the raster's own projection, just cropped).
"""
import json, math, os, sys
from PIL import Image, ImageEnhance

DATA = sys.argv[1]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_IMG = os.path.join(ROOT, 'assets', 'maps')
W, H = 360, 640  # scene units
PX = 2           # image is 2x scene units

# center lat/lon, latitude span. Pins and labels use real coordinates (lat, lon).
MAPS = {
    'world': dict(c=(16, 34), span=104,
        rivers=['Nile'],
        pins=[(-3.0, 35.4, 'East Africa')],
        route=[[(-3.0, 35.4), (12, 40), (22, 38.5), (30.0, 33.5), (33.5, 40), (38, 52), (42, 66)],
               [(30.0, 33.5), (37, 30), (45, 20), (52, 12)]],
        labels=[(8, 20, 'AFRICA', 18), (50, 30, 'EUROPE', 15), (44, 60, 'ASIA', 15), (25, 45, 'ARABIA', 11)]),
    'fertile': dict(c=(33, 42), span=20,
        rivers=['Tigris', 'Euphrates'],
        region=[(31.2, 35.3), (33.4, 35.9), (35.6, 36.6), (36.8, 38.6), (37.0, 40.8), (36.4, 43.0), (34.6, 44.4), (32.8, 45.6), (31.2, 46.8), (30.4, 47.6)],
        pins=[(30.96, 46.10, 'Ur'), (31.32, 45.64, 'Uruk', 'l'), (32.54, 44.42, 'Babylon', 'l')],
        labels=[(37.6, 39.4, 'Fertile Crescent', 12), (34.6, 41.2, 'Euphrates', 11, 'river'), (35.6, 44.6, 'Tigris', 11, 'river'),
                (29.2, 47.2, 'Persian Gulf', 10, 'water'), (27.0, 41.0, 'Arabian Desert', 11)]),
    'nile': dict(c=(24.5, 32.5), span=18,
        rivers=['Nile', 'Atbara'],
        pins=[(29.98, 31.13, 'Giza'), (25.70, 32.64, 'Thebes'), (18.53, 31.82, 'Napata'), (16.94, 33.75, 'Meroë')],
        labels=[(31.3, 29.2, 'Lower Egypt', 11), (26.8, 30.6, 'Upper Egypt', 11), (20.2, 34.2, 'KUSH', 15),
                (32.9, 30.0, 'Mediterranean Sea', 10, 'water'), (23.2, 36.6, 'Red Sea', 10, 'water'), (22.5, 28.6, 'Sahara', 12)]),
    'india': dict(c=(25, 77), span=32,
        rivers=['Indus', 'Ganges', 'Yamuna', 'Sutlej', 'Chenab', 'Jhelum'],
        pins=[(30.63, 72.86, 'Harappa'), (27.33, 68.14, 'Mohenjo-daro'), (24.70, 84.99, 'Bodh Gaya')],
        labels=[(33.5, 80.5, 'Himalayas', 12), (25.6, 70.2, 'Indus', 11, 'river'), (26.4, 82.0, 'Ganges', 11, 'river'),
                (18.0, 69.6, 'Arabian Sea', 10, 'water'), (16.0, 84.0, 'Bay of Bengal', 10, 'water')]),
    'china': dict(c=(34, 112.5), span=26,
        rivers=['Huang', 'Wei', 'Yangtze', 'Chang Jiang'],
        pins=[(36.10, 114.35, 'Anyang (Shang)'), (34.34, 108.94, "Xi'an")],
        labels=[(38.2, 111.0, 'Yellow River', 11, 'river'), (30.2, 113.6, 'Yangtze', 11, 'river'),
                (42.3, 110.0, 'Gobi Desert', 11)]),
    'greece': dict(c=(38.3, 23.6), span=8,
        rivers=[],
        pins=[(37.98, 23.73, 'Athens'), (37.07, 22.43, 'Sparta'), (37.64, 21.63, 'Olympia')],
        labels=[(38.6, 25.4, 'Aegean Sea', 11, 'water'), (37.0, 21.3, 'Ionian Sea', 10, 'water'), (39.6, 22.0, 'GREECE', 14)]),
    'rome': dict(c=(39, 17), span=42,
        rivers=['Tiber', 'Nile'],
        pins=[(41.90, 12.50, 'Rome'), (36.85, 10.32, 'Carthage'), (37.98, 23.73, 'Athens'), (31.20, 29.92, 'Alexandria')],
        labels=[(35.0, 17.5, 'Mediterranean Sea', 11, 'water'), (43.5, 11.6, 'ITALY', 12), (49.5, 10.0, 'EUROPE', 13), (28.0, 10.0, 'AFRICA', 13)]),
    'silk': dict(c=(34, 72.4), span=112,
        rivers=['Huang', 'Indus', 'Amu  Darya', 'Syr  Darya', 'Tigris', 'Euphrates'],
        route=[[(34.34, 108.94), (36.06, 103.83), (40.14, 94.66), (39.47, 75.99), (39.65, 66.96), (37.66, 62.19), (33.09, 44.58), (36.20, 36.16)]],
        pins=[(34.34, 108.94, "Chang'an"), (39.65, 66.96, 'Samarkand'), (36.20, 36.16, 'Antioch')],
        labels=[(30.0, 92.0, 'CHINA', 12), (42.5, 41.0, 'to Rome', 11), (44.5, 82.5, 'Silk Road', 13)]),
}


def frame(m):
    lat0, lon0 = m['c']
    lat_span = m['span']
    lon_span = lat_span * (W / H) / math.cos(math.radians(lat0))
    return lat0 + lat_span / 2, lon0 - lon_span / 2, lat_span, lon_span


def projector(m):
    top, left, lat_span, lon_span = frame(m)
    return lambda lat, lon: ((lon - left) / lon_span * W, (top - lat) / lat_span * H)


# ── geometry helpers ──
def clip_poly(ring, x0, y0, x1, y1):
    def clip(pts, inside, inter):
        out = []
        for i, cur in enumerate(pts):
            prev = pts[i - 1]
            if inside(cur):
                if not inside(prev): out.append(inter(prev, cur))
                out.append(cur)
            elif inside(prev): out.append(inter(prev, cur))
        return out
    def ix(a, b, x): t = (x - a[0]) / (b[0] - a[0]); return (x, a[1] + t * (b[1] - a[1]))
    def iy(a, b, y): t = (y - a[1]) / (b[1] - a[1]); return (a[0] + t * (b[0] - a[0]), y)
    pts = ring
    for inside, inter in [(lambda p: p[0] >= x0, lambda a, b: ix(a, b, x0)), (lambda p: p[0] <= x1, lambda a, b: ix(a, b, x1)),
                          (lambda p: p[1] >= y0, lambda a, b: iy(a, b, y0)), (lambda p: p[1] <= y1, lambda a, b: iy(a, b, y1))]:
        if not pts: break
        pts = clip(pts, inside, inter)
    return pts


def simplify(pts, tol):
    if len(pts) < 3: return pts
    def rdp(a, b):
        (x1, y1), (x2, y2) = pts[a], pts[b]
        dx, dy = x2 - x1, y2 - y1
        n = math.hypot(dx, dy) or 1e-9
        best, idx = 0, None
        for i in range(a + 1, b):
            d = abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / n
            if d > best: best, idx = d, i
        if best > tol and idx is not None: return rdp(a, idx)[:-1] + rdp(idx, b)
        return [pts[a], pts[b]]
    sys.setrecursionlimit(100000)
    return rdp(0, len(pts) - 1)


def d_of(pts, close=False):
    if len(pts) < 2: return ''
    s = 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in pts)
    return s + ('Z' if close else '')


def lines_in_box(pts, pad=20):
    """Split a polyline into runs that are inside the padded frame."""
    runs, cur = [], []
    for p in pts:
        if -pad <= p[0] <= W + pad and -pad <= p[1] <= H + pad: cur.append(p)
        else:
            if len(cur) > 1: runs.append(cur)
            cur = []
    if len(cur) > 1: runs.append(cur)
    return runs


def geoms(feature):
    g = feature['geometry']
    if not g: return []
    if g['type'] == 'Polygon': return [g['coordinates']]
    if g['type'] == 'MultiPolygon': return g['coordinates']
    if g['type'] == 'LineString': return [[g['coordinates']]]
    if g['type'] == 'MultiLineString': return [[c] for c in g['coordinates']]
    return []


def main():
    os.makedirs(OUT_IMG, exist_ok=True)
    Image.MAX_IMAGE_PIXELS = None
    print('loading raster...')
    src = Image.open(os.path.join(DATA, 'NE1_HR_LC_SR_W.tif')).convert('RGB')
    land = json.load(open(os.path.join(DATA, 'ne_10m_land.geojson')))['features']
    rivers = json.load(open(os.path.join(DATA, 'ne_10m_rivers_lake_centerlines.geojson')))['features']
    lakes = json.load(open(os.path.join(DATA, 'ne_10m_lakes.geojson')))['features']
    out = {}
    for name, m in MAPS.items():
        top, left, lat_span, lon_span = frame(m)
        proj = projector(m)
        # raster crop: 1/60 degree per pixel, origin at (-180, 90)
        box = ((left + 180) * 60, (90 - top) * 60, (left + lon_span + 180) * 60, (90 - top + lat_span) * 60)
        img = src.crop(tuple(round(v) for v in box)).resize((W * PX, H * PX), Image.LANCZOS)
        img = ImageEnhance.Color(img).enhance(1.12)
        img = ImageEnhance.Contrast(img).enhance(1.06)
        img.save(os.path.join(OUT_IMG, f'{name}.jpg'), quality=82, optimize=True, progressive=True)

        tol = 0.35 if lat_span < 30 else 0.6
        coast = []
        for f in land:
            for poly in geoms(f):
                ring = [proj(lat, lon) for lon, lat in poly[0]]
                xs = [p[0] for p in ring]; ys = [p[1] for p in ring]
                if max(xs) < -10 or min(xs) > W + 10 or max(ys) < -10 or min(ys) > H + 10: continue
                c = simplify(clip_poly(ring, -6, -6, W + 6, H + 6), tol)
                if len(c) > 2: coast.append(d_of(c, True))
        lk = []
        for f in lakes:
            if (f['properties'].get('scalerank') or 9) > 6: continue
            for poly in geoms(f):
                ring = [proj(lat, lon) for lon, lat in poly[0]]
                c = simplify(clip_poly(ring, -6, -6, W + 6, H + 6), tol)
                if len(c) > 2: lk.append(d_of(c, True))
        main_r, minor_r = [], []
        for f in rivers:
            p = f['properties']; nm = p.get('name') or ''
            key = any(k == nm or (k in nm and len(k) > 3) for k in m['rivers'])
            if not key and (p.get('scalerank') or 9) > (5 if lat_span > 60 else 7): continue
            for g in geoms(f):
                for run in lines_in_box([proj(lat, lon) for lon, lat in g[0]]):
                    d = d_of(simplify(run, tol * 0.8))
                    if d: (main_r if key else minor_r).append(d)
        pins = [dict(x=round(proj(p[0], p[1])[0], 1), y=round(proj(p[0], p[1])[1], 1), t=p[2], side=(p[3] if len(p) > 3 else '')) for p in m.get('pins', [])]
        labels = [dict(x=round(proj(l[0], l[1])[0], 1), y=round(proj(l[0], l[1])[1], 1), t=l[2], s=l[3], k=(l[4] if len(l) > 4 else 'land')) for l in m.get('labels', [])]
        routes = [d_of([proj(la, lo) for la, lo in r]) for r in m.get('route', [])]
        region = d_of([proj(la, lo) for la, lo in m['region']]) if m.get('region') else ''
        out[name] = dict(img=f'assets/maps/{name}.jpg', coast=' '.join(coast), lakes=' '.join(lk),
                         rivers=' '.join(main_r), minor=' '.join(minor_r), routes=routes, region=region, pins=pins, labels=labels)
        print(f'{name}: {len(coast)} coast parts, {len(main_r)} key river runs, {len(minor_r)} minor, img {os.path.getsize(os.path.join(OUT_IMG, name + ".jpg")) // 1024} KB')
    js = ('// Generated by tools/build_maps.py from Natural Earth (public domain). Do not edit by hand.\n'
          '// Overlay paths are in the 360x640 scene space, matching assets/maps/<name>.jpg.\n'
          f'export const MAPS = {json.dumps(out, separators=(",", ":"))};\n')
    open(os.path.join(ROOT, 'src', 'maps.js'), 'w').write(js)
    print('src/maps.js', len(js) // 1024, 'KB')


if __name__ == '__main__':
    main()
