import React, { useState, useEffect } from 'react';
import axios from 'axios';

import loadingIcon from '../assets/loading.svg';
import CharacterSingle from '../components/CharacterSingle.js';

const CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000;

function Characters() {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCharacterId, setSelectedCharacterId] = useState(null);

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                let cachedCharacters = localStorage.getItem('cachedCharacters');
                let cachedTimestamp = localStorage.getItem('cachedTimestamp');
                const currentTime = new Date().getTime();

                if (cachedCharacters && cachedTimestamp) {
                    if (currentTime - parseInt(cachedTimestamp) < CACHE_EXPIRATION_TIME) {
                        setCharacters(JSON.parse(cachedCharacters));
                        setLoading(false);
                        return;
                    } else {
                        localStorage.removeItem('cachedCharacters');
                        localStorage.removeItem('cachedTimestamp');
                    }
                }

                let allCharacters = [];
                let nextPage = 'https://swapi.dev/api/people/';
        
                while (nextPage) {
                    const response = await axios.get(nextPage);
                    allCharacters = [...allCharacters, ...response.data.results];
                    nextPage = response.data.next;
                }

                localStorage.setItem('cachedCharacters', JSON.stringify(allCharacters));
                localStorage.setItem('cachedTimestamp', currentTime);
        
                setCharacters(allCharacters);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchCharacters();
    }, []);

    if (loading) {
        return (
            <div className="loadingIcon">
                <img src={loadingIcon} alt="Loading" className="loadingIcon" /><br />
                Loading Content from API
            </div>
        );
    }

    if (error) {
        return (
            <p>Error: {error.message}</p>
        );
    }

    const handleCardClick = (characterId) => {
        setSelectedCharacterId(characterId);
    };

    return (
        <div className="cards">
            {characters.map((character, index) => {
                const formattedCharacter = formatCharacterInformation(character);
                return (
                    <div key={index} className={`card ${formattedCharacter.formattedSpecies}`} data-name={character.name} data-id={formattedCharacter.formattedID} onClick={() => handleCardClick(formattedCharacter.formattedID)}>
                        <h2>{formattedCharacter.formattedName}</h2>
                        <div className="info">
                            <strong>Name:</strong> {character.name}<br />
                            <strong>Height:</strong> {formattedCharacter.formattedHeight}<br />
                            <strong>Mass:</strong> {formattedCharacter.formattedMass}<br />
                            <strong>Added:</strong> {formattedCharacter.formattedCreateDate}<br />
                            <strong>Films:</strong> {character.films.length}<br />
                            <strong>Birth Year:</strong> {formattedCharacter.formattedBirthYear}<br />
                        </div>
                    </div>
                );
            })}
            {selectedCharacterId && <CharacterSingle id={selectedCharacterId} />}
        </div>
    );
}

const formatCharacterInformation = (character) => {
    const formattedName = (
        <div>
            <span>{character.name.split(" ")[0]}</span><br />
            {character.name.split(" ")[1]}
        </div>
    );

    const formattedID = character.url.split("/").slice(-2, -1)[0];
    const formattedHeight = character.height === "unknown" ? "Unknown" : `${parseFloat(character.height) / 100}m`;
    const formattedMass = character.mass === "unknown" ? "Unknown" : `${parseFloat(character.mass)}kg`;
    const formattedCreateDate = new Date(character.created).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
    });
    const formattedBirthYear = character.birth_year === "unknown" ? "Unknown" : character.birth_year;

    let species = 'unknown';
    if (character.species[0]) {
        const speciesId = character.species[0].split('/').filter(Boolean).pop();
        species = `species-${speciesId}`;
    }

    return {
        ...character,
        formattedID,
        formattedName,
        formattedHeight,
        formattedMass,
        formattedCreateDate,
        formattedBirthYear,
        formattedSpecies: species,
    };
};

export default Characters;