import re, sys

base = '_bmad-output/ux-dark-mode-dualtone-icons/'
exp = open(base + 'EXPERIENCE.md', encoding='utf-8').read()
des = open(base + 'DESIGN.md', encoding='utf-8').read()

# 1. frontmatter parses
if not exp.startswith('---\n'):
    print('FAIL: no opening delimiter'); sys.exit(1)
end = exp.index('\n---\n', 3)
fm = exp[3:end]
try:
    import yaml
    data = yaml.safe_load(fm)
    print('YAML OK:', list(data.keys()))
except ImportError:
    print('pyyaml missing'); sys.exit(1)
except Exception as e:
    print('YAML FAIL:', e); sys.exit(1)

# 2. required spine sections
secs = re.findall(r'^## (.+)$', exp, re.M)
required = ['Foundation', 'Information Architecture', 'Voice and Tone',
            'Component Patterns', 'State Patterns', 'Interaction Primitives',
            'Accessibility Floor', 'Key Flows']
missing = [s for s in required if s not in secs]
print('sections:', secs)
print('missing required:', missing if missing else 'NONE')
if missing: sys.exit(1)

# 3. DESIGN.md token cross-references resolve
refs = set(re.findall(r'\{((?:colors|components)\.[a-z0-9-]+)\}', exp))
dangling = []
for r in refs:
    section, key = r.split('.', 1)
    if section == 'colors':
        ok = re.search(rf"^  {key}: '#", des, re.M)
    else:
        ok = re.search(rf"^  {key}:$", des, re.M)
    if not ok:
        dangling.append(r)
print('token refs:', sorted(refs) if refs else 'none')
print('dangling refs:', dangling if dangling else 'NONE')
if dangling: sys.exit(1)

# 4. dark mode toggle coverage
for needle in ['localStorage', 'prefers-color-scheme', 'no-flash', 'MobileNav',
               'role="switch"', 'aria-checked', 'theme']:
    if needle.lower() not in exp.lower():
        print('MISSING toggle concept:', needle); sys.exit(1)
print('toggle concepts covered: localStorage, system-preference, no-flash, placement, a11y')

print('ALL CHECKS PASSED')
