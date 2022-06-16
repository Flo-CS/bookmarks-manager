import {DataTypes, Sequelize} from 'sequelize';
import {SpecialsCollections} from '../src/helpers/collections';
import * as path from "path"
import {app} from 'electron';

const ARRAY_SEPARATOR = ";";

export const databasePath = path.join(app.getPath("userData"), "main.db");
export const sequelize = new Sequelize({dialect: "sqlite", storage: databasePath});

export const Bookmark = sequelize.define('Bookmark', {
    linkTitle: DataTypes.STRING,
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tags: {
        type: DataTypes.TEXT,
        set(tags: string[]) {
            this.setDataValue("tags", tags.join(ARRAY_SEPARATOR))
        },
        get() {
            const tags = this.getDataValue('tags');
            return tags ? tags.split(ARRAY_SEPARATOR) : [];
        }
    },
    description: DataTypes.STRING,
    collection: {
        type: DataTypes.STRING,
        defaultValue: SpecialsCollections.WITHOUT_COLLECTION,
        allowNull: false
    },
    variant: {
        type: DataTypes.ENUM("icon", "preview"),
        defaultValue: "preview",
        allowNull: false
    },
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    faviconPath: DataTypes.STRING,
    previewPath: DataTypes.STRING,
    siteName: DataTypes.STRING,
    openHistory: {
        type: DataTypes.TEXT,
        set(dates: Date[]) {
            this.setDataValue("openHistory", dates.map(date => date.toUTCString()).join(ARRAY_SEPARATOR))
        },
        get() {
            const dates = this.getDataValue('openHistory');
            return dates ? dates.split(ARRAY_SEPARATOR).map((date: string) => new Date(date)) : [];
        }
    },
    copyHistory: {
        type: DataTypes.TEXT,
        set(dates: Date[]) {
            console.log(dates.map(date => date.toUTCString()).join(ARRAY_SEPARATOR))
            this.setDataValue("copyHistory", dates.map(date => date.toUTCString()).join(ARRAY_SEPARATOR))
        },
        get() {
            const dates = this.getDataValue('copyHistory');
            return dates ? dates.split(ARRAY_SEPARATOR).map((date: string) => new Date(date)) : [];
        }
    },
}, {
    timestamps: true,
    createdAt: "creationDate",
    updatedAt: 'modificationDate'
});

export const Collection = sequelize.define('Collection', {
        id: {type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4},
        name: DataTypes.STRING,
        iconPath: {
            type: DataTypes.STRING,
            allowNull: true
        },
        parent: {type: DataTypes.UUID, defaultValue: SpecialsCollections.ROOT},
        isFolded: {type: DataTypes.BOOLEAN, defaultValue: true},
    },
    {
        timestamps: true,
        createdAt: "creationDate",
        updatedAt: 'modificationDate'
    });

(async () => {
    await sequelize.sync();
})();