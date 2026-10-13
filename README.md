# River Gauge

A fictional garden team planning watering from supplied local zone records. The planner is deterministic, and garden coordinators decide whether to execute a plan.

Use npm and Node.js 24+. Keep any software local and credential-free, using checked-in fictional inputs.

## Local planner

```sh
npm ci --ignore-scripts
npm test
```

Import the real JavaScript module directly:

```js
import { planWatering } from './src/water-plan.mjs';

const plan = planWatering([
  { id: 'herb-bed', moisturePercent: 12, requestedLitres: 3 },
  { id: 'flower-bed', moisturePercent: 20, requestedLitres: 5 },
]);
// { zones: [{ id: 'herb-bed', requestedLitres: 3 }], totalLitres: 3 }
```

The [watering policy](moldea/context/watering-policy.md) owns the input and
selection contract. The planner only returns a proposal; coordinators approve
execution. It has no equipment, model-provider, database, UI, or credential
integration.

<!-- moldea:start -->

This project uses [moldea](https://skill.moldea.ai) to keep project knowledge in Git and bring relevant context into coding-agent work.
Start at [the project overview](moldea/project.md); [the manifest](moldea/moldea.yaml) maps context and implementation relationships.
<!-- moldea:end -->
