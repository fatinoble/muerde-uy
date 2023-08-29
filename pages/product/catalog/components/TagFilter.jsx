import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, InputAdornment } from '@mui/material';
import { Filter } from '../../../../src/svg'

const TagFilter = ({ allTags, selectedTags, setSelectedTags }) => {

  const handleTagSelection = (event) => {
    setSelectedTags(event.target.value);
  };

  return (
    <div className="tag-container">
      <FormControl className="tag-filter-form-control">

        <InputLabel id="tag-filter-label" className="input-label-tag"> <Filter /></InputLabel>
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
    </div>
  );
};

export default TagFilter;
