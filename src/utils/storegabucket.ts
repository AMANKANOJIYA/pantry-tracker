import { getStorage } from "firebase/storage";
import { app } from "./firebaseConfig";

const storage = getStorage(app, "gs://pantry-app-b1511.appspot.com");

export default storage;
