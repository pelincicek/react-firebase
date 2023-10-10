import { useEffect, useState } from 'react';
import './App.css';
import { Auth } from './components/auth';
import { db, auth } from './config/firebase';
import { getDocs, collection, addDoc, deleteDoc, updateDoc, doc} from 'firebase/firestore';

function App() {
  const [movieList, setMovieList] = useState([]);

  // New Movie States
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(true);

  //Update Title State
  const [updatedTitle, setUpdatedTitle] = useState("");

  // firebase database'imizden movies collection'ımızı alalım.
  const moviesCollectionRef = collection(db, "movies");

  const onSubmitMovie = async () => {
    try{
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid,
        pelin :true, //test, firebase database'imizde pelin adında bir alan oluştu.
      });
      getMovieList();
    } catch(err){
      console.error(err);
    }

  }
  // firebase'den movies collection'ımızdan veri silmek için.
  const deleteMovie = async (id) => {
      const movieDoc = doc(db,"movies",id);
      await deleteDoc(movieDoc); 
      getMovieList();
  }

  // firebase'den movies collection'ımızdan veri güncellemek için.
  const updateMovieTitle = async (id) => {
      const movieDoc = doc(db,"movies",id);
      await updateDoc(movieDoc, {title: updatedTitle}); 
      getMovieList();
  }

  const getMovieList = async () => {
      try{
        // async koymak için awati olmak zorundadır. 
        const data = await getDocs(moviesCollectionRef);
        //console.log("burdayım",data.docs);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(), 
          id: doc.id
        }));
        setMovieList(filteredData);
      } catch(err){
        console.log(err);
      }
    };

     // useEffect sayfa yüklenmeden önce çalıştıracağımız functionlar için kullanıyoruz.
  useEffect(() => { 
    getMovieList();
    console.log("burdayım",movieList);
  }, []); //onSubmit butonuna basıldıgında burası yeniden tetikleniyor.


  return (
    <div className="App">
  {/* auth componentini ekrana koyalımç */}
     <Auth />
     <h1>Movie CRUD</h1>
  
  {/* insert için form yapalım. */}
  <div>
    <input placeholder="Movice Title..." 
           onChange = {(e) => setNewMovieTitle(e.target.value)}
    />
    <input placeholder="Release Date..." type="number"
           onChange = {(e) => setNewReleaseDate(Number(e.target.value))}
    />
    <input type="checkbox" 
           checked={isNewMovieOscar} 
           onChange={(e) => setIsNewMovieOscar(e.target.checked)}
    /> 
    <label>Received an Oscar</label>
    <button onClick={onSubmitMovie}>Submit Movie</button>
  </div>
    {/* movie datasını ekrana basalım. */}
     <div>
      {movieList.map((movie) => (
        <div key={movie.id}>
          <h1 style={{ color: movie.receivedAnOscar ? "green" : "red"}}>
            {movie.title}
          </h1>
          <p>Date : {movie.releaseDate}</p> 
          <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>
          <input placeholder="Update Title" 
                 onChange={(e) => setUpdatedTitle(e.target.value)}
          />
          <button onClick={() => updateMovieTitle(movie.id)}>Update Movie</button>
        </div>
      ))}
     </div>
    </div>
  );
}

export default App;
