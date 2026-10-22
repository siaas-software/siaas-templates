# SIAAS Personal Templates

The canonical source for the Personal project templates used by [SIAAS Personal](https://github.com/siaas-software/siaas-personal) and the [public website](https://siaas.vercel.app/).

## Templates

| Template | Assistants | Importable file |
| --- | --- | --- |
| Computer Science Study | 3 | [computer-science-study.json](templates/computer-science-study.json) |
| Home Gardening | 3 | [home-gardening.json](templates/home-gardening.json) |
| Software Engineering | 3 | [software-engineering.json](templates/software-engineering.json) |

Download a JSON file and import it from Templates in SIAAS Personal. Files retain `siaas-project-v1`. Each assistant owns a `sources` array of public URL strings and has `model: null`, allowing a recommendation for the destination computer. Color belongs only to the project. Documents, local folders, local paths, downloaded content, embeddings, chats and indexing metadata are never exported.

Creating a project from a template registers sources even offline. Supported pages are fetched and indexed locally when available; failed or pending sources can be retried from Knowledge. Source enablement is local; all imported sources start enabled. These links reference third-party pages, whose availability and extraction restrictions may change.

Catalog-only categories, display order and translations live in `listings.json`. The generated `catalog.json` combines them with the portable definitions for app/site maintainers; importable files in `templates/` contain only `format` and `project`.

## Contribute

1. Edit or add a file under `templates/`. Keep existing filenames stable: these are the built-in template IDs used to preserve users' changes and deletions.
2. Provide the project configuration in `templates/` and its category, display order and English/Italian descriptions in `listings.json`. Never add `listing` to portable files.
3. Run `npm run build` and `npm test` with Node.js 22+ (no dependencies to install).
4. Commit the template files and generated `catalog.json` together.
5. In each consumer repository run `npm run templates:sync -- --ref <commit-sha>` and commit the generated data and `templates-source.json`.

The consumers keep generated snapshots for offline use and reproducible builds. They no longer own template definitions. A catalog update is deliberately adopted by commit SHA; it does not silently replace a user's saved templates. The template repository is public. Maintainers pin a reviewed catalog revision; end users use the bundled snapshot without repository credentials. For a local checkout, add `--catalog ../siaas-templates/catalog.json` to the sync command.

## License

Original code and content in this repository are licensed under [MIT](LICENSE).
Third-party dependencies retain their own licenses.
