import { defineAgent } from 'eve';

export default defineAgent({
  description:
    'Finds checked-in Field Notes case records and operational notes, then returns relevant source paths and excerpts to the root assistant.',
  model: 'openai/gpt-5.4',
  defaultTools: false,
});
