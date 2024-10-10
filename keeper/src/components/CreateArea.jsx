import React from "react";

function CreateArea(props) {

  const [formInput, setFormInput] = React.useState({
    title: "",
    content: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormInput(prevValue => {
      return {
        ...prevValue,
        [name]: value
      }});
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
      <form>
        <input name="title" placeholder="Title" value={formInput.title} onChange={handleChange} />
        <textarea name="content" placeholder="Take a note..." rows="3" value={formInput.content} onChange={handleChange} />
        <button onClick={handleClick}>Add</button>
      </form>
    </div>
  );
}

export default CreateArea;
