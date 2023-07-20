import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, InputAdornment } from '@mui/material';
import { Filter } from '../../../../src/svg'

const TagFilter = ({ allTags, selectedTags, setSelectedTags }) => {

  const handleTagSelection = (event) => {
    setSelectedTags(event.target.value);
  };

  return (
    <>
      <FormControl className="tag-filter-form-control">

        <InputLabel id="tag-filter-label" > <Filter /></InputLabel>
        <Select
          labelId="tag-filter-label"
          id="tag-filter-select"
          multiple
          value={selectedTags}
          onChange={handleTagSelection}
          renderValue={(selected) => selected.join(', ')}
        >
          {allTags?.map((tag) => (
            <MenuItem key={tag} value={tag}>
              {tag}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default TagFilter;
