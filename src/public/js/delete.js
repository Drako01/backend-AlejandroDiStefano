document.addEventListener("DOMContentLoaded", () => {   
    const deleteButton = document.getElementById("deleteInactiveButton");
    deleteButton.addEventListener("click", async () => {
        try {
            await axios.post("/users/deleteInactiveUsers");     
            window.location.href = "/users";   
        } catch (error) {
            throw new Error(error);
        }
        
    });
});
