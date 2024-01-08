document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('btn_deleteAllPlayers').addEventListener('click', function() {
        try {
            fetch('/deleteAllPlayers')
            .then(response => response.json())
            .then(data => {
                console.log(data);
            });
        } catch (error) {
            console.log(error);
        }
    });
    document.getElementById('btn_printAllPlayers').addEventListener('click', function() {
        try {
            fetch('/printAllPlayers')
            .then(response => response.json())
            .then(data => {
                console.log(data);
            });
        } catch (error) {
            console.log(error);
        }
    });
});