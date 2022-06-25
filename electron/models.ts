import {DataTypes, Sequelize} from "sequelize"
import {TopCollections} from '../src/helpers/collections';
import * as path from "path"
import {app} from 'electron';
import {BookmarkVariant} from "../src/helpers/bookmarks";
import {WebsiteMetadata, WebsitePicture} from "../src/helpers/websiteMetadata";
import {getWebsitePicture} from "./dataFiles";

const ARRAY_SEPARATOR = ";";

export const databasePath = path.join(app.getPath("userData"), "main.db");


export const sequelize: Sequelize = new Sequelize({dialect: "sqlite", storage: databasePath});

export const Website = sequelize.define<any, any>("Website", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    url: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false,
        unique: true,
        validate: {
            isUrl: true,
        }
    },
    title: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT("tiny")
    },
    faviconPicture: {
        type: DataTypes.TEXT("tiny"),
        validate: {
            isUrl: true
        },
        get(): WebsitePicture | undefined {
            if (!this.getDataValue("faviconPicture")) {
                return undefined
            }
            return getWebsitePicture("favicon", this.getDataValue("faviconPicture"), this.id)
        }
    },
    previewPicture: {
        type: DataTypes.TEXT("tiny"),
        validate: {
            isUrl: undefined
        },
        get(): WebsitePicture | undefined {
            if (!this.getDataValue("previewPicture")) {
                return undefined
            }
            return getWebsitePicture("preview", this.getDataValue("previewPicture"), this.id)
        }
    },
    metadata: {
        type: DataTypes.VIRTUAL,
        get(): WebsiteMetadata {
            return {
                description: this.description,
                title: this.title,
                pictures: {
                    preview: this.previewPicture,
                    favicon: this.faviconPicture
                }
            };
        },
    },
}, {timestamps: true, createdAt: "creationDate", updatedAt: "modificationDate"})

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
        defaultValue: TopCollections.MAIN,
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
            defaultValue: TopCollections.MAIN
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
    await sequelize.sync({force: true, alter: true});
})();