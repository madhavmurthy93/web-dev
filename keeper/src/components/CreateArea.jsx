import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import { Zoom } from "@mui/material";

function CreateArea(props) {

  const [formInput, setFormInput] = React.useState({
    title: "",
    content: ""
  });

  const [isExpanded, setExpanded] = React.useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormInput(prevValue => {
      return {
        ...prevValue,
        [name]: value
      }});
  }

  function handleInputClick() {
    setExpanded(true);
  }


  function handleClick(event) {
    event.preventDefault();
    props.onAdd(formInput);
    setFormInput({
      title: "",
      content: "" 
    });
  }

  return (
    <div>
      <form className="create-note">
        {isExpanded ? (
          <>
          <input name="title" placeholder="Title" value={formInput.title} onChange={handleChange} />
          <textarea name="content" placeholder="Take a note..." rows="3" value={formInput.content} onChange={handleChange} onClick={handleInputClick} />
          <Zoom in={true}>
            <Fab onClick={handleClick}>
              <AddIcon />
            </Fab>
          </Zoom>
          </>
        ) : (
          <textarea name="content" placeholder="Take a note..." rows="1" value={formInput.content} onChange={handleChange} onClick={handleInputClick} />
          )}
      </form>
    </div>
  );
}

export default CreateArea;
