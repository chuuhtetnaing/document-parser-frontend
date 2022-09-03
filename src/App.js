import DragNDrop from "./DragNDrop";
import { useEffect, useState } from "react";
import axios from "axios";
import fileDownload from "js-file-download";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Slider,
  Snackbar,
  Stack,
  styled,
  TextField,
} from "@mui/material";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";

function App() {
  const [files, setFiles] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [reqType, setReqType] = useState("paragraph");

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  useEffect(() => {
    console.log("files", files);
  }, [files]);

  const onSubmitFile = () => {
    setLoading(true);
    const formData = new FormData();
    // formData.append('files', files);

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    // formData.append("typee", "figure");
    // formData.append('fileName', file.name);
    const config = {
      responseType: "blob",
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    const url = `http://chuuhtetnaing.ddns.net:8000/uploadfiles/${reqType}/${pageNumber}/`;
    axios
      .post(url, formData, config)
      .then((response) => response.data)
      .then((data) => {
        setLoading(false);
        setOpen(true);
        fileDownload(data, "result.xlsx");
      })
      .catch((err) => console.log("err", err));
  };

  const PrettoSlider = styled(Slider)({
    color: "#52af77",
    height: 8,
    "& .MuiSlider-track": {
      border: "none",
    },
    "& .MuiSlider-thumb": {
      height: 24,
      width: 24,
      backgroundColor: "#fff",
      border: "2px solid currentColor",
      "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
        boxShadow: "inherit",
      },
      "&:before": {
        display: "none",
      },
    },
    "& .MuiSlider-valueLabel": {
      lineHeight: 1.2,
      fontSize: 12,
      background: "unset",
      padding: 0,
      width: 32,
      height: 32,
      borderRadius: "50% 50% 50% 0",
      backgroundColor: "#52af77",
      transformOrigin: "bottom left",
      transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
      "&:before": { display: "none" },
      "&.MuiSlider-valueLabelOpen": {
        transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
      },
      "& > *": {
        transform: "rotate(45deg)",
      },
    },
  });

  const onSliderChange = (e) => {
    console.log(e.target.value);
    setPageNumber(e.target.value);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <h1>TheWalnut.AI</h1>
        <h5>Convert Your Document</h5>
        <DragNDrop files={files} setFiles={setFiles} />
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={reqType}
            onChange={(e) => setReqType(e.target.value)}
          >
            <FormControlLabel
              value="paragraph"
              control={<Radio />}
              label="Paragraph"
            />
            <FormControlLabel
              value="sentence"
              control={<Radio />}
              label="Sentence"
            />
            <FormControlLabel value="table" control={<Radio />} label="Table" />
          </RadioGroup>
        </FormControl>
        {loading ? (
          <CircularProgress />
        ) : (
          <Button variant="contained" onClick={() => onSubmitFile()}>
            Extract
          </Button>
        )}
      </Stack>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Box sx={{ width: 300 }}>
          <PrettoSlider
            valueLabelDisplay="auto"
            aria-label="pretto slider"
            defaultValue={pageNumber}
            min={1}
            max={numPages}
            marks
            value={pageNumber}
            onChange={(e) => onSliderChange(e)}
          />
        </Box>
        <TextField
          size="small"
          sx={{ width: 100 }}
          id="outlined-basic"
          label="Page No"
          variant="outlined"
          value={pageNumber}
          type="number"
          onChange={(e) => setPageNumber(parseInt(e.target.value))}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        />
        <div>
          <div style={{ border: "1px black dotted" }}>
            <Document file={files[0]} onLoadSuccess={onDocumentLoadSuccess}>
              <Page height={500} pageNumber={pageNumber} />
            </Document>
          </div>
        </div>
      </Stack>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          The excel file is successfully download!
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
