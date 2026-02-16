import { auth } from "../js/firebase.js";
import { getUserRole } from "../js/services/roleService.js";

auth.onAuthStateChanged(async (user) => {

  if (!user) {
    window.location.href = "../login.html";
    return;
  }

  const role = await getUserRole();

  if (role !== "admin") {
    alert("Akses hanya untuk Admin!");
    window.location.href = "../index.html";
  }

});
