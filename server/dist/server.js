"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const hourStringToMinutes_1 = require("./utils/hourStringToMinutes");
const minutesToHourString_1 = require("./utils/minutesToHourString");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/games', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const games = yield prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true,
                },
            },
        },
    });
    res.status(200).json(games);
}));
app.get('/ads/:id/discord', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const ad = yield prisma.ad.findUniqueOrThrow({
        select: { discord: true },
        where: { id },
    });
    res.status(200).json({ discord: ad.discord });
}));
app.get('/games/:id/ads', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const ads = yield prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true,
        },
        where: {
            gameId: id,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    res.status(200).json(ads.map((ad) => {
        return Object.assign(Object.assign({}, ad), { weekDays: ad.weekDays.split(','), hourEnd: (0, minutesToHourString_1.minutesToHourString)(ad.hourEnd), hourStart: (0, minutesToHourString_1.minutesToHourString)(ad.hourStart) });
    }));
}));
app.post('/ads', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const ad = yield prisma.ad.create({
        data: {
            gameId: body.gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: (0, hourStringToMinutes_1.hourStringToMinutes)(body.hourStart),
            hourEnd: (0, hourStringToMinutes_1.hourStringToMinutes)(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel,
        },
    });
    res.status(201).json(ad);
}));
app.use(((err, _req, res, _next) => {
    res.status(500).json({ error: `Erro: ${err.message}` });
}));
app.listen(3333, () => console.log('running on 3333'));
