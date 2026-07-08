from fastapi import FastAPI
from pydantic import BaseModel

import torch
import torch.nn.functional as F

from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification
)

app = FastAPI()

MODEL_NAME = "hwynwin/aura-phobert-v1"

tokenizer = None
model = None


@app.on_event("startup")
def load_model():
    global tokenizer, model

    print("Loading tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    print("Tokenizer loaded!")

    print("Loading model...")
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
    print("Model loaded!")

    model.eval()
    print("Ready!")


id2label = {
    0: "NEUTRAL",
    1: "STRESS",
    2: "HAPPY",
    3: "ANGRY",
    4: "EXCITED",
    5: "SAD",
    6: "ANXIETY"
}


class JournalRequest(BaseModel):
    text: str


@app.get("/")
def home():
    return {
        "message": "Aura Emotion Service Running"
    }


@app.post("/predict")
def predict(data: JournalRequest):

    inputs = tokenizer(
        data.text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    )

    with torch.no_grad():
        outputs = model(**inputs)

    probs = F.softmax(outputs.logits, dim=1)[0]

    pred_id = torch.argmax(probs).item()
    confidence = probs[pred_id].item()

    scores = {
        id2label[i]: round(float(probs[i]), 4)
        for i in range(len(id2label))
    }

    return {
        "emotion": id2label[pred_id],
        "confidence": round(confidence, 4),
        "scores": scores
    }