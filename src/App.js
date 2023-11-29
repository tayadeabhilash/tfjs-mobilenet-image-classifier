import React, { useState, useEffect, useRef } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import {
  Button,
  Card,
  CardContent,
  Divider,
  Input,
  Stack,
  Typography,
  ThemeProvider,
  createTheme,
  Grid,
  IconButton,
  CardHeader,
  Avatar,
} from '@mui/material';
import Header from './components/header';
import { Info } from '@mui/icons-material';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';

require('@tensorflow/tfjs-core'); /* or @tensorflow/tfjs-node */
require('@tensorflow/tfjs-backend-cpu');
const theme = createTheme({
  palette: {
    primary: {
      main: '#006D77',
    },
    secondary: {
      main: '#83C5BE',
    },
    tertiary: {
      main: '#EDF6F9',
    },
  },
});

function App() {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [results, setResults] = useState([]);
  const fileInputRef = useRef();
  const textInputRef = useRef();
  const imageRef = useRef();

  const uploadImage = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageUrl(url);
    } else {
      setImageUrl(null);
    }
  };

  const uploadTrigger = () => {
    fileInputRef.current.click();
  };

  const handleInputChange = (e) => {
    setImageUrl(e.target.value);
    setResults([]);
  };

  const loadModel = async () => {
    setIsModelLoading(true);
    try {
      const model = await mobilenet.load();
      setModel(model);
      setIsModelLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadModel();
  }, []);

  if (isModelLoading) {
    return (
      <ThemeProvider theme={theme}>
        <div style={{ textAlign: 'center', paddingTop: '50vh' }}>
          <Typography variant="h4">Initializing the model. Please Wait...</Typography>
        </div>
      </ThemeProvider>
    );
  }

  const detectImage = async () => {
    textInputRef.current.value = '';
    const results = await model.classify(imageRef.current);
    setResults(results);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Header />
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={6}>
            <Card sx={{ backgroundColor: theme.palette.tertiary.main, marginTop: 4 }}>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={3}
                  divider={<Divider orientation="vertical" flexItem useFlexGap />}
                >
                  <input
                    type="file"
                    accept="image/*"
                    capture="camera"
                    style={{ display: 'none' }}
                    onChange={uploadImage}
                    ref={fileInputRef}
                  />
                  <Button variant="contained" color="secondary" onClick={uploadTrigger}>
                    Upload Image
                  </Button>
                  <Typography variant="body2" color="textSecondary">
                    OR
                  </Typography>
                  <Input
                    type="text"
                    placeholder="Enter Image URL"
                    inputProps={{ 'aria-label': 'image URL' }}
                    onChange={handleInputChange}
                    inputRef={textInputRef}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" spacing={2} sx={{padding:"16px"}}>
          <Grid item xs={12} sm={8} md={6}>
            {imageUrl && (
              <Card>
                <CardContent>
                  <div>
                    <img
                      src={imageUrl}
                      alt="Preview"
                      crossOrigin="anonymous"
                      ref={imageRef}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </div>
                  {imageUrl && (
                    <Button variant="contained" color="secondary" onClick={detectImage}>
                      Detect Image
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </Grid>
          <Grid item xs={12} sm={8} md={6}>
            {results.length > 0 && (
              <Card>
                <CardHeader
                  title="Classification Results"
                  subheader="Results based on MobileNet model"
                  avatar={
                    <Avatar sx={{ backgroundColor: theme.palette.secondary.main }}>
                      <DonutLargeIcon />
                    </Avatar>
                  }
                />
                <Divider />
                <CardContent>
                  <Stack spacing={2}>
                    {results.map((result, index) => (
                      <Card key={result.className} variant="outlined">
                        <CardContent>
                          <Typography variant="h6">{result.className}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            Accuracy Level: {(result.probability * 100).toFixed(2)}%
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}

export default App;
