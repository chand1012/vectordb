# VectorDB

VectorDB is a super simple vector database API written in Deno using OpenAI embeddings API.

## Usage

See the [API Documentation](api.md).

## Building

The only build dependency is [Deno](https://deno.land). To build the project, run the following commands:

```sh
git clone https://github.com/chand1012/vectordb.git
cd vectordb
deno compile --allow-net --allow-write --allow-read --allow-env --output bin/vectordb main.ts
```

## Using with Docker Compose

Here's an example of how to use VectorDB in a Docker Compose project:

```yaml
version: "3.9"

services:
  vectordb:
    image: ghcr.io/chand1012/vectordb:main
    volumes:
      - ./data:/app/data
    ports:
      - "8000:8000"
```

## Environment Variables

| Variable          | Description                                    | Default         |
|-------------------|------------------------------------------------|-----------------|
| OPENAI_API_KEY    | Your OpenAI API key.                           |                 |
| VECTORDB_HOST     | The host address for VectorDB.                 | 127.0.0.1       |
| VECTORDB_PORT     | The port VectorDB listens on.                  | 8000            |
| AUTH              | Optional token for authorization checks.       | None            |
| VECTORDB_LOCATION | The location of the vector database file.      | data/vector.db  |
