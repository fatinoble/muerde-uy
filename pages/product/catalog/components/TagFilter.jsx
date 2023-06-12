import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const TagFilter = ({ allTags, selectedTags, setSelectedTags }) => {

  const handleTagSelection = (event) => {
    setSelectedTags(event.target.value);
  };

  return (
    <FormControl sx={{ marginTop: '10px', minWidth: '200px' }}>
      <InputLabel id="tag-filter-label">Filtrar por etiquetas</InputLabel>
      <Select
        labelId="tag-filter-label"
        id="tag-filter-select"
        multiple
        value={selectedTags}
        onChange={handleTagSelection}
        renderValue={(selected) => selected.join(', ')}
      >
        {allTags.map((tag) => (
          <MenuItem key={tag} value={tag}>
            {tag}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TagFilter;
