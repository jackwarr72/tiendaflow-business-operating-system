import re, sys

p = '_bmad-output/ux-dark-mode-dualtone-icons/DESIGN.md'
t = open(p, encoding='utf-8').read()

if not t.startswith('---\n'):
    print('FAIL: no opening frontmatter delimiter'); sys.exit(1)
end = t.index('\n---\n', 3)
fm = t[3:end]

try:
    import yaml
    data = yaml.safe_load(fm)
    colors = data.get('colors', {})
    print('YAML OK, top keys:', list(data.keys()))
except ImportError:
    print('pyyaml missing - regex fallback')
    colors = dict(re.findall(r"^  ([a-z0-9-]+): '#", fm, re.M))
except Exception as e:
    print('YAML FAIL:', e); sys.exit(1)

refs = set(re.findall(r'\{colors\.([a-z0-9-]+)\}', t))
missing = refs - set(colors.keys())
print('color refs:', len(refs), 'defined:', len(colors), 'missing:', sorted(missing) if missing else 'NONE')

stale = [h for h in ['#4338CA','#6366F1','#F59E0B','#22C55E','#EF4444','#FBF9F4','#F1EDE6','#E6E0D6','#1A1917','#6B655C','#9B9388','#0D0D0C','#161513','#24231F','#F4F1EA','#B5AE9E','#8A8377','#818CF8','#A5B4FC','#FBBF24','#4ADE80','#F87171'] if h in t]
print('stale old hexes:', stale if stale else 'NONE')

for name, hexv in colors.items():
    if hexv is None or not re.fullmatch(r'#[0-9A-Fa-f]{6}', str(hexv)):
        print('BAD hex value:', name, hexv); sys.exit(1)

sections = re.findall(r'^## (.+)$', t, re.M)
print('sections:', sections)
expected = ['Brand & Style', 'Colors', 'Typography', 'Layout & Spacing', 'Elevation & Depth', 'Shapes', 'Components', "Do's and Don'ts"]
if sections == expected:
    print('SECTION ORDER OK')
else:
    print('SECTION ORDER MISMATCH, expected:', expected); sys.exit(1)

anchors = ['#BDDDFC', '#88BDF2', '#384959']
if all(a in t for a in anchors):
    print('ANCHOR TRIO PRESENT')
else:
    print('ANCHOR TRIO MISSING'); sys.exit(1)

print('ALL CHECKS PASSED')
