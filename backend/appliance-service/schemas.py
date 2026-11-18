from pydantic import BaseModel, Field, HttpUrl, ConfigDict


class ApplianceBase(BaseModel):
    image_url: str | None = Field(default=None, max_length=1000)
    manufacturer: str = Field(min_length=1, max_length=120)
    model: str = Field(min_length=1, max_length=120)
    output_kw: float = Field(gt=0, le=1000)
    efficiency_percent: float = Field(gt=0, le=100)
    description: str | None = Field(default=None, max_length=2000)


class ApplianceCreate(ApplianceBase):
    pass


class ApplianceRead(ApplianceBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
