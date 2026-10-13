# Grounded label examples

These are fictional input/output fixtures, not collection records or taxonomic
claims. Every label value is grounded in its accompanying supplied notes. Do not
reuse their values for other specimens.

## Complete supplied notes

Input:

```text
Accession: MA-0042
Taxon: Hypnum sp.
Collector: Mira Chen
Collection date: 2026-03-14
Locality: East path, Brook Garden
Substrate: fallen branch
Notes: capsules absent
```

Output:

```text
Moss Atlas
Accession: MA-0042
Taxon: Hypnum sp.
Collector: Mira Chen
Collection date: 2026-03-14
Locality: East path, Brook Garden
Substrate: fallen branch
Notes: capsules absent
```

## Uncertainty and a partial date

Input:

```text
MA-0107; taxon: Bryum sp.?; collector: Jo Vale; collected: May 2026;
locality: possibly west edge of Brook Garden; substrate: soil;
determiner: Ren Ortiz.
```

Output:

```text
Moss Atlas
Accession: MA-0107
Taxon: Bryum sp.?
Collector: Jo Vale
Collection date: May 2026
Locality: possibly west edge of Brook Garden
Substrate: soil
Notes: Determiner: Ren Ortiz
```

The question mark, uncertain locality, and month-only date remain unchanged.

## Missing data and a field tag

Input:

```text
Field tag: 27. Locality: north meadow. Notes: damp when packed.
No accession, taxon, collector, collection date, or substrate supplied.
```

Output label:

```text
Moss Atlas
Accession: [not supplied]
Taxon: [not supplied]
Collector: [not supplied]
Collection date: [not supplied]
Locality: north meadow
Substrate: [not supplied]
Notes: Field tag: 27; damp when packed
```

Checks: accession, taxon, collector, collection date, and substrate not supplied.

Do not turn field tag `27` into `MA-0027`. Likewise, a supplied accession `MA-27`
would yield `Accession: [needs confirmation]` and an outside-label check quoting
`MA-27`; it would not be silently padded.
