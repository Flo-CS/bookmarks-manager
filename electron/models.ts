import {DataTypes, Sequelize} from 'sequelize';
import {SpecialFolders} from '../src/helpers/folders';
import * as path from "path";
import {app} from "electron";

const ARRAY_SEPARATOR = ";";
console.log(app.getPath("userData"))
export const database = new Sequelize({dialect: "sqlite", storage: path.join(app.getPath("userData"), "test.db")});

export const Bookmark = database.define('Bookmark', {
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
        defaultValue: SpecialFolders.WITHOUT_FOLDER,
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
            console.log(dates.map(date => date.toUTCString()).join(";"))
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

export const Folder = database.define('Folder', {
        key: DataTypes.STRING,
        name: DataTypes.STRING,
        iconPath: {
            type: DataTypes.STRING,
            allowNull: true
        },
        children: {
            type: DataTypes.TEXT,
            set(children: string[]) {
                this.setDataValue("children", children.join(ARRAY_SEPARATOR))
            },
            get() {
                const children = this.getDataValue('children');
                return children ? children.split(ARRAY_SEPARATOR) : [];
            }
        },
        parent: DataTypes.UUID,
        isFolded: DataTypes.BOOLEAN,
    },
    {
        timestamps: true,
        createdAt: "creationDate",
        updatedAt: 'modificationDate'
    });

(async () => {
    await database.sync({});
})();