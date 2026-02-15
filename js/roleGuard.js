import { getUserRole } from "./services/roleService.js";

(async () => {
  const role = await getUserRole();
  if (role !== "admin") {
    alert("Akses hanya untuk Admin!");
    location.href = "../index.html";
  }
})();
