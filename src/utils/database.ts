// firebaseUtils.js
import {
  getDatabase,
  ref,
  push,
  set,
  get,
  remove,
  orderByChild,
  equalTo,
  query,
  update,
} from "firebase/database";
import { app } from "./firebaseConfig";

const db = getDatabase(app);

const createData = async (path: any, data: any) => {
  const newRef = push(ref(db, path));
  await set(newRef, data);
  return newRef;
};

const getAllData = async (path: any) => {
  const snapshot = await get(ref(db, path));
  return snapshot.val();
};

const getDataById = async (path: any, id: any) => {
  const snapshot = await get(ref(db, `${path}/${id}`));
  return snapshot.val();
};

const getDataByRefId = async (path: any, id: any) => {
  var arr: any = [];
  const itemsRef = ref(db, path);
  const itemsQuery = query(itemsRef, orderByChild("productRef"), equalTo(id));
  try {
    const snapshot = await get(itemsQuery);
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot: any) => {
        try {
          arr.push([childSnapshot.key, childSnapshot.val()]);
        } catch (error) {
          console.error("Error Finding item:", error);
        }
      });
    } else {
      console.log("No items found with the specified product ID.");
    }
  } catch (error) {
    console.error("Error fetching items:", error);
  }
  return arr;
};

const deleteDataByIdProd = async (userId: any, id: any) => {
  const newRef = ref(db, `${userId}/products/${id}`);

  remove(newRef)
    .then(() => {
      console.log("Remove succeeded.");
    })
    .catch((error) => {
      console.log("Remove failed: " + error.message);
    });

  const itemsRef = ref(db, `${userId}/items`);
  const itemsQuery = query(itemsRef, orderByChild("productRef"), equalTo(id));
  try {
    const snapshot = await get(itemsQuery);
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot: any) => {
        try {
          remove(childSnapshot.ref);
          console.log("Item deleted:", childSnapshot.key);
        } catch (error) {
          console.error("Error deleting item:", error);
        }
      });
    } else {
      console.log("No items found with the specified product ID.");
    }
  } catch (error) {
    console.error("Error fetching items:", error);
  }
};

const deleteDataById = async (path: any, id: any) => {
  const newRef = ref(db, `${path}/${id}`);
  remove(newRef)
    .then(() => {
      console.log("Remove succeeded.");
    })
    .catch((error) => {
      console.log("Remove failed: " + error.message);
    });
};

const updateElement = async (path: any, item: any) => {
  const newRef = ref(db, `${path}`);
  console.log("Updating item:", item, path);
  await update(newRef, item);
  console.log("Update succeeded.", newRef);
  return newRef;
};

export {
  createData,
  getAllData,
  deleteDataByIdProd,
  getDataById,
  getDataByRefId,
  deleteDataById,
  updateElement,
};
