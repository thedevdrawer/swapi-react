import React, { useEffect } from 'react';

function Search() {
    useEffect(() => {
        const filterCards = () => {
            const inputValue = document.querySelector("#searchInput").value.trim().toLowerCase();
            const cards = document.querySelectorAll(".card");

            cards.forEach((card) => {
                const cardName = card.getAttribute("data-name");
                if (cardName && cardName.toLowerCase().includes(inputValue)) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        };

        const searchInput = document.querySelector("#searchInput");
        searchInput.addEventListener("input", filterCards);

        return () => {
            searchInput.removeEventListener("input", filterCards);
        };
    }, []);

    return (
        <section className="search">
            <input type="text" id="searchInput" placeholder="Search by character name" />
        </section>
    );
}

export default Search;
