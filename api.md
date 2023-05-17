# API Documentation

This API provides a basic interface for storing and searching vectors with additional metadata.

## Endpoints

### /add

* Method: `POST`
* Content-Type: `application/json`
* Request Body:
  + `text` (string, optional): The text associated with the vector
  + `source` (string, optional): The source of the vector
  + `url` (string, optional): The URL associated with the vector
  + `embedding` (array of numbers, optional): The embedding of the text
* Response type: JSON
* Description: Adds a new vector to the database. Either `text` or `embedding` must be provided.

**Curl Example**:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"text": "sample text", "source": "example.com", "url": "https://example.com/document"}' http://localhost:8000/add
```

---

### /get

* Method: `GET`
* Response type: JSON
* Request Parameters:
  + `id` (integer): The ID of the vector to get
* Description: Retrieves a vector by ID

**Curl Example**:

```bash
curl http://localhost:8000/get?id=1
```

---

### /search

* Method: `GET`
* Response type: JSON
* Request Parameters:
  + `q` (string): The text to search for
* Description: Searches for vectors in the database matching the given text

**Curl Example**:

```bash
curl http://localhost:8000/search?q=sample%20text
```

---

### /search

* Method: `POST`
* Content-Type: `application/json`
* Request Body:
  + `embedding` (array of numbers, required): The embedding to search for
* Response type: JSON
* Description: Searches for vectors in the database using the provided embedding

**Curl Example**:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"embedding": [0.1, 0.2, ...]}' http://localhost:8000/search
```