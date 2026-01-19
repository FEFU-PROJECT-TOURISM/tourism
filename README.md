# tourism


<h2>How to start</h2>

* <h3> fill .env </h3>
<h4>Create .env file from .env.example</h4>

* <h3> Copy env files </h3>
Copy created .env to /backend and /frontend


* <h3> Run docker compose </h3>
```
docker compose up -d
```

* <h3>Start migrations to database </h3>
<h4> Go to backend docker container</h4>

```
docker exec -it <backend-container-name> bash
```
<h4>Inside container</h4>

```
alembic revision --autogenerate -m "<your comment>" && alembic upgrade head
```

Default urls:
```
backend docs: http://127.0.0.1:8000/docs
frontend: http://127.0.0.1:5173
grafana: http://127.0.0.1:3000
adminer (for Postgres): http://127.0.0.1:8081
```

<h2>To start without Docker</h2>

* <h3>Setup Database</h3>
    <h4>Install PostgreSQL on your system, start it</h4>


* <h3>Setup backend</h3>
    <h4>Create virtual env</h4>
    
    ```
    python -m venv venv
    ```
    <h4>Activate virtual env</h4>

    * Linux (Не точно)
    ```
    source venv/bin/activate
    ```
    * Windows
    ```
    ./venv/Scripts/activate
    ```
    <h4>Install all packages</h4>

    ```
    pip install --no-cache-dir -r requirements.txt
    ```

    <>



<h2>Help</h2>
* To see docker containers (and names): docker ps