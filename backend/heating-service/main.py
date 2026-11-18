from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="Home Energy Calculator - Heating Service", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class RoomCalculation(BaseModel):
    length_m: float = Field(gt=0, le=100)
    width_m: float = Field(gt=0, le=100)
    height_m: float = Field(gt=0, le=20)
    target_temp_c: float = Field(ge=16, le=22)
    insulation: str
    appliance_kw: float = Field(gt=0, le=1000)


@app.get("/health")
def health():
    return {"status": "ok", "service": "heating-service"}


@app.post("/calculate")
def calculate(room: RoomCalculation):
    factors = {"poor": 50, "average": 35, "good": 20}
    insulation = room.insulation.lower()
    if insulation not in factors:
        return {"error": "Insulation must be poor, average or good"}

    volume_m3 = room.length_m * room.width_m * room.height_m

    # Demonstration-only estimate. Not suitable for real equipment sizing.
    base_w_per_m3 = factors[insulation]
    temperature_factor = (room.target_temp_c - 16) / 4
    estimated_demand_kw = volume_m3 * base_w_per_m3 / 1000 * temperature_factor

    surplus_ratio = room.appliance_kw / max(estimated_demand_kw, 0.1)
    screening_warning = (
        room.appliance_kw > estimated_demand_kw * 1.5
        if estimated_demand_kw > 0 else True
    )

    return {
        "volume_m3": round(volume_m3, 2),
        "estimated_heat_demand_kw": round(estimated_demand_kw, 2),
        "selected_appliance_kw": room.appliance_kw,
        "nominally_suitable": room.appliance_kw >= estimated_demand_kw,
        "potential_oversizing_warning": screening_warning,
        "output_to_estimated_demand_ratio": round(surplus_ratio, 2),
        "warning": (
            "Screening estimate only. This does not predict room temperature "
            "or whether 24°C will be reached within one hour."
        ),
    }
