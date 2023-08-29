import { Cancel, Tag } from "@mui/icons-material";
import { FormControl, Stack, TextField, Typography, InputAdornment, Button } from "@mui/material";
import { Box } from "@mui/system";
import { useRef, useState } from "react";
import AddIcon from '@mui/icons-material/Add';

const Tags = ({ data, handleDelete }) => {
  return (
    <Box
      sx={{
        background: "#283240",
        height: "100%",
        display: "flex",
        padding: "0.4rem",
        margin: "0 0.5rem 0 0",
        justifyContent: "center",
        alignContent: "center",
        color: "#ffffff",
      }}
    >
      <Stack direction='row' gap={1}>
        <Typography>{data}</Typography>
        <Cancel
          sx={{ cursor: "pointer" }}
          onClick={() => {
            handleDelete(data);
          }}
        />
      </Stack>
    </Box>
  );
};

const DynamicTags = ({ tags = [], setTags = () => { } }) => {
  const tagRef = useRef();
  const [tagValue, setTagValue] = useState("");

  const handleDelete = (value) => {
    const newtags = tags.filter((val) => val !== value);
    setTags(newtags);
  };
  const handleOnSubmit = (e) => {
    e.preventDefault();
    setTags([...tags, tagRef.current.value]);
    tagRef.current.value = "";
    setTagValue("");
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <form onSubmit={handleOnSubmit}>
        <TextField
          inputRef={tagRef}
          value={tagValue}
          onChange={(e) => setTagValue(e.target.value)}
          fullWidth
          variant='standard'
          size='small'
          sx={{ margin: "1rem 0" }}
          margin='none'
          placeholder={tags.length < 3 ? "Agregar tag *" : ""}
          InputProps={{
            endAdornment: (
              <Button
                disabled={!tagValue}
                position="end"
                onClick={handleOnSubmit}
                style={{
                  backgroundColor: !tagValue ? "grey" : "rgb(216, 130, 130)",
                  color: "white",
                  marginRight: "5px",
                  height: "25px",
                  paddingRight: "20px"
                }}>
                <AddIcon
                  edge="end"
                >
                </AddIcon>
                Agregar
              </Button>
            ),
            startAdornment: (
              <Box sx={{ margin: "0 0.2rem 0 0", display: "flex" }}>
                {tags.map((data, index) => {
                  return (
                    <Tags data={data} handleDelete={handleDelete} key={index} />
                  );
                })}
              </Box>
            ),
          }}
        />
      </form>
    </Box>
  );
}

export default DynamicTags;
