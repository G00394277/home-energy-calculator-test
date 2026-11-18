# Home Energy Calculator (starter)

A minimal Irish-market starter project using React + Vite, FastAPI, PostgreSQL, Docker Compose and GitHub Actions.

## Included
- React landing page, appliance catalogue with create/edit/delete, and room calculator.
- FastAPI appliance CRUD service backed by PostgreSQL.
- Separate FastAPI heating-calculation service.
- Docker Compose setup and basic GitHub Actions image-build workflow.
- Appliance image URL field (actual file storage/upload is deliberately left for a later step).

## Requirements
- Docker Desktop with Docker Compose
- Git
- VS Code (recommended)

## Run on Windows
1. Extract this ZIP.
2. Open the `home-energy-calculator` folder in VS Code.
3. Copy `.env.example` to `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```
4. Start the application:
   ```powershell
   docker compose up --build
   ```
5. Open:
   - Frontend: http://localhost:3000
   - Appliance API docs: http://localhost:8001/docs
   - Heating API docs: http://localhost:8002/docs
   - Gateway API docs: http://localhost:8000/docs

Stop with `Ctrl+C`, then:
```powershell
docker compose down
```

To remove the local database volume as well (this permanently deletes local data):
```powershell
docker compose down -v
```

## Notes / limitations
- This is a development starter, not production-ready.
- The gateway currently provides a health/root endpoint; the frontend calls the appliance and heating services directly.
- Database tables are created automatically for this starter. Add Alembic migrations before evolving the schema.
- Appliance images are stored as URLs, not uploaded files. Add validated file uploads and object storage before production.
- The room heat-demand formula is a deliberately simplified placeholder. It is NOT an engineering heat-loss calculation and must not be used to size real heating equipment.
- The overheating result is a screening warning only. Predicting whether a room reaches 24°C within one hour requires a dynamic thermal model with room fabric, thermal mass, ventilation, initial conditions and heater control behaviour.
- No authentication, authorisation, backups, secrets management, monitoring or production deployment is included.

## Service ports
| Component | Local URL |
|---|---|
| React frontend | http://localhost:3000 |
| API gateway | http://localhost:8000 |
| Appliance service | http://localhost:8001 |
| Heating service | http://localhost:8002 |
| PostgreSQL | localhost:5432 |

## Useful commands
```powershell
docker compose ps
docker compose logs -f
docker compose down
```
