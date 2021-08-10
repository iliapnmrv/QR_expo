import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('dbName', version);
class database extends Component {
    render() {
        db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
            console.log('Foreign keys turned on')
        );
    }
}

export default database