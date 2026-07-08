import sys
import os
vendor_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "_vendor"))
if os.path.exists(vendor_dir) and vendor_dir not in sys.path:
    sys.path.insert(0, vendor_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import hr, finance, inventory, auth


app = FastAPI(title="VFF IMS API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root Endpoint
@app.get("/")
async def root():
    return {"message": "VFF Integrated Management System API is online"}

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(hr.router, prefix="/api/hr", tags=["HR"])
app.include_router(finance.router, prefix="/api/finance", tags=["Finance"])
app.include_router(inventory.router, prefix="/api/inventory", tags=["Inventory"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
