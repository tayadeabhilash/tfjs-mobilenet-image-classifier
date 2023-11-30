import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import {
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import Header from "./header";

const AccuracyCalculator = () => {
  const [progress, setProgress] = useState("");
  const [accuracyText, setAccuracyText] = useState("");
  const [animalData, setAnimalData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [model, setModel] = useState();

  const loadModelAndWords = async () => {
    try {
      setProgress("Loading model...");

      const model = await mobilenet.load();
      setModel(model);
      setProgress("Model loaded.");

      let correctPredictions = 0;
      let totalPredictions = 0;

      for (const [folder, images] of Object.entries(animalData)) {
        for (const image of images) {
          const img = document.getElementById(`${folder}${image}`);

          const predictions = await model.classify(img);

          const hasFolderPrediction = predictions.some((prediction) =>
            prediction.className.toLowerCase().includes(folder)
          );

          if (hasFolderPrediction) {
            correctPredictions++;
          }

          totalPredictions++;

          if (totalPredictions % 10 === 0) {
            setProgress(
              `Progress: ${totalPredictions} / ${
                Object.values(animalData).flat().length
              }`
            );
          }
        }
      }

      const accuracy = (correctPredictions / totalPredictions) * 100;
      console.log(`Accuracy: ${accuracy.toFixed(2)}%`);
      setAccuracyText(`Accuracy: ${accuracy.toFixed(2)}%`);
    } catch (error) {
      console.error("Error during evaluation:", error.message);
      setProgress("Error during evaluation. Check console for details.");
    }
  };

  useEffect(() => {
    const loadJson = async () => {
      try {
        const response = await fetch("/animals/output.json");
        const data = await response.json();
        setAnimalData(data);
        setLoaded(true);
      } catch (error) {
        console.error("Error fetching animal data:", error);
      }
    };

    if (loaded === false) loadJson();
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="md" style={{ paddingTop: "20px" }}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              Model Evaluation
            </Typography>
            <Typography variant="body1" style={{ marginBottom: "10px" }}>
              MobileNet is a pre-trained model. Evaluating it on a generic
              dataset may not yield optimal results. This evaluation uses the{" "}
              <a
                href="https://www.kaggle.com/datasets/iamsouravbanerjee/animal-image-dataset-90-different-animals"
                target="_blank"
                rel="noopener noreferrer"
              >
                Animal Image Dataset
              </a>{" "}
              with a reduced set of 180 images due to tfjs api browser
              compatibility.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={loadModelAndWords}
            >
              Evaluate
            </Button>
            <Typography variant="body1" style={{ margin: "10px 0" }}>
              {progress}
            </Typography>
            <Typography variant="body1">{accuracyText}</Typography>
            {animalData && (
              <div>
                {Object.keys(animalData).map((folder) =>
                  animalData[folder].map((image) => (
                    <img
                      key={folder + image}
                      id={folder + image}
                      src={`/animals/${folder}/${image}`}
                      alt="Animal"
                      style={{ display: "none" }}
                    />
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default AccuracyCalculator;
