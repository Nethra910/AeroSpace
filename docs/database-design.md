# MANI Aerospace — Database Design

## Tables

### users

- id
- email
- password_hash
- role
- created_at

### news

- id
- title
- category
- author
- summary
- content
- published
- published_at
- created_at
- updated_at

### home_content

- id
- hero_label
- headline
- highlight
- lead
- focus_areas

### mission_content

- id
- introduction
- mission_statement
- pillars

### directors

- id
- name
- din
- designation
- appointment_date

### team_members

- id
- name
- degree
- academic_year
- university

## Notes

- Store passwords as hashes, never plain text.
- Use proper relationships and constraints during implementation.
- Confirm actual team and director data with the client.
