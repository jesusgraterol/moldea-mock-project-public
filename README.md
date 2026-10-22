# Saffron Menus

Saffron Menus helps the Saffron café team prepare its weekly menu card. The kitchen records each week's dishes in a JSON file under `menus/`, and the team turns that file into a printable Markdown card under `cards/`.

The `menu-card` project skill drafts a card from a week's menu file. Price labels come from `src/price-labels.js`.

## Development

Requires Node.js 22.17 or later. Run the tests with:

```sh
npm test
```

<!-- moldea:start -->

This project uses [moldea](https://skill.moldea.ai) to keep project knowledge in Git and bring relevant context into coding-agent work.
Start at [the project overview](moldea/project.md); [the manifest](moldea/moldea.yaml) maps context and implementation relationships.
<!-- moldea:end -->
