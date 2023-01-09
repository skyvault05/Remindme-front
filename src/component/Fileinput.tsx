import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React from "react";

const FileInput = () => {
  const [selectedImage, setSelectedImage] = React.useState<any>(null);
  const [imageUrl, setImageUrl] = React.useState<any>(null);

  React.useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  return (
    <>
      <input
        accept="image/*"
        type="file"
        id="select-image"
        style={{ display: "none" }}
        onChange={(e) => {
          if (!e.target.files) return;
          setSelectedImage(e.target.files[0]);
        }}
      />
      <label htmlFor="select-image">
        <Button variant="contained" color="primary" component="span">
          Upload Image
        </Button>
      </label>
      {!imageUrl && !selectedImage && (
        <Box mt={2} textAlign="center">
          <img src="blob:http://localhost:3000/fca17228-ce42-4c00-96e6-d8e8cee0b08b" alt="" width="100%" height="150px" />
        </Box>
      )}
      {imageUrl && selectedImage && (
        <Box mt={2} textAlign="center">
          <img src={imageUrl} alt={selectedImage.name} width="100%" height="150px" />
        </Box>
      )}
    </>
  );
};

export default FileInput;
