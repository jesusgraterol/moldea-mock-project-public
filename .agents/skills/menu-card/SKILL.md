---
name: menu-card
description: Draft the Saffron café's weekly menu card from a week's menu file. Use when asked to prepare, draft, or refresh a menu card.
---

# Menu card

Draft a printable Markdown menu card for one week.

1. Read the requested week's file under `menus/`, such as `menus/week-43.json`.
2. Read `moldea/context/menu-style.md` for the card's layout and voice, and `moldea/context/allergens.md` for how allergens are shown.
3. Write the card to `cards/week-<week>.md`, replacing an existing card for that week.
4. List every dish in the order of the menu file. Do not invent dishes, ingredients, or allergens.

Report the card's path and any dish whose data was incomplete.
