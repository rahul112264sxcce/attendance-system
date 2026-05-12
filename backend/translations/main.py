from fastapi import APIRouter
from utils.translations import translations


router = APIRouter(tags=["Translations"])


@router.get("/translations")
async def get_translation():

    return translations