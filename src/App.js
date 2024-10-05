import React, { useState, useEffect } from 'react';
import { db, storage, auth } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        signInAnonymously(auth);
      }
    });
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      const querySnapshot = await getDocs(collection(db, 'images'));
      const imagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setImages(imagesData); 
    };
    fetchImages();
  }, []);

  const uploadImage = async () => {
    if (image && imageName.trim()) {
      setLoading(true);
      try {
        // Create a reference to the storage location
        const storageRef = ref(storage, `images/${imageName}`);
        console.log(storageRef); // Log the reference for debugging
        
        // Upload the image
        await uploadBytes(storageRef, image);
        const url = await getDownloadURL(storageRef);
        await addDoc(collection(db, 'images'), { url, name: imageName });
        setImages(prevImages => [...prevImages, { url, name: imageName }]);
      } catch (error) {
        console.error("Error uploading image: ", error);
        alert("Failed to upload image.");
      } finally {
        setLoading(false);
        setImage(null);
        setImageName('');
      }
    } else {
      alert("Please provide a valid image name.");
    }
  };
  

  const deleteImage = async (id) => {
    await deleteDoc(doc(db, 'images', id));
    setImages(images.filter(img => img.id !== id));
  };

  return (
    <div className="App">
      <h1>Image Gallery</h1>
      {user ? (
        <>
          <input 
            type="text" 
            value={imageName} 
            onChange={(e) => setImageName(e.target.value)} 
            placeholder="Image Name" 
          />
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setImage(e.target.files[0])} 
          />
          <button onClick={uploadImage}>Upload Image</button>
          <div className="gallery">
            {images.map((img) => (
              <div key={img.id} className="image-container">
                <img src={img.url} alt={img.name} />
                <button onClick={() => deleteImage(img.id)}>Delete</button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
