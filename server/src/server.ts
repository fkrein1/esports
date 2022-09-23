import { PrismaClient } from '@prisma/client';
import express, { ErrorRequestHandler } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { hourStringToMinutes } from './utils/hourStringToMinutes';
import { minutesToHourString } from './utils/minutesToHourString';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors())

app.get('/games', async (_req, res) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true,
        },
      },
    },
  });
  res.status(200).json(games);
});

app.get('/ads/:id/discord', async (req, res) => {
  const { id } = req.params;
  const ad = await prisma.ad.findUniqueOrThrow({
    select: { discord: true },
    where: { id },
  });
  res.status(200).json({ discord: ad.discord });
});

app.get('/games/:id/ads', async (req, res) => {
  const { id } = req.params;
  const ads = await prisma.ad.findMany({
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
  res.status(200).json(
    ads.map((ad) => {
      return {
        ...ad,
        weekDays: ad.weekDays.split(','),
        hourEnd: minutesToHourString(ad.hourEnd),
        hourStart: minutesToHourString(ad.hourStart),
      };
    }),
  );
});

app.post('/ads', async (req, res) => {
  const body = req.body;
  const ad = await prisma.ad.create({
    data: {
      gameId: body.gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(','),
      hourStart: hourStringToMinutes(body.hourStart),
      hourEnd: hourStringToMinutes(body.hourEnd),
      useVoiceChannel: body.useVoiceChannel,
    },
  });
  res.status(201).json(ad);
});

app.use(((err, _req, res, _next) => {
  res.status(500).json({ error: `Erro: ${err.message}` });
}) as ErrorRequestHandler);

app.listen(port, () => console.log(`running on port ${port}`));
