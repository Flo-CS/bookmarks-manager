import {DataTypes, Sequelize} from 'sequelize';
import {SpecialsCollections} from '../src/helpers/collections';
import * as path from "path"
import {app} from 'electron';
import {BookmarkVariant} from "../src/helpers/bookmarks";

const ARRAY_SEPARATOR = ";";

export const databasePath = path.join(app.getPath("userData"), "main.db");
export const sequelize = new Sequelize({dialect: "sqlite", storage: databasePath});


export const Bookmark = sequelize.define('Bookmark', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    collection: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: SpecialsCollections.WITHOUT_COLLECTION,
    },
    variant: {
        type: DataTypes.ENUM(...Object.values(BookmarkVariant)),
        allowNull: false,
        defaultValue: BookmarkVariant.PREVIEW,
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
    description: {
        type: DataTypes.STRING
    },
    linkTitle: {
        type: DataTypes.STRING
    },
    faviconPath: {
        type: DataTypes.STRING
    },
    previewPath: {
        type: DataTypes.STRING
    },
    siteName: {
        type: DataTypes.STRING
    },
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
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4
        },
        parent: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: SpecialsCollections.MAIN
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isFolded: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        iconPath: {
            type: DataTypes.STRING
        },
    },
    {
        timestamps: true,
        createdAt: "creationDate",
        updatedAt: 'modificationDate'
    });

(async () => {
    await sequelize.sync();
})();