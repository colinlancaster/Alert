# Alert

## Create an Alert

```javascript
Alert.CreateAlert('Hello');
```

## Create a Prompt

```javascript
 const html = `
        <h2>Enter your search below</h2>
        <form class="searchForm" action="{% url 'search-results' %}" method="POST">
            <select name="entity" id="entity">
                <option value="band">Band</option>
                <option value="post">Post</option>
                <option value="album">Albums</option>
                <option value="recordLabel">Record Label</option>
                <option value="song">Song</option>
            </select>
            <input class="searchInput" type="search" name="searchValue" placeholder="Search">
            <button type="submit">Search</button>
        </form>
        <br/><br/>
        `;
Alert.CreatePrompt(html);
```