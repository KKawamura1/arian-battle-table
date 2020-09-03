import * as path from 'path';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as serve from 'koa-static';
import * as bodyParser from 'koa-bodyparser';
import Pug from 'koa-pug';
import { createConnection, getConnectionOptions } from 'typeorm';
import { Character } from './models/character';
import { BattleSession } from './models/battle-session';
import { mkRouter } from './mk-router';
import { pathCanonicalizer } from 'koa-path-canonicalizer';
import { StateT, CustomT } from '../types';
import { BadStatus } from './models/bad-status';

async function mkApp(): Promise<void> {
    const connectionOptions = await getConnectionOptions();

    const connection = await createConnection({
        ...connectionOptions,
        entities: [Character, BattleSession, BadStatus],
    });

    const WORKDIR: string = '/workdir';

    const app = new Koa<StateT, CustomT>();
    const router = new Router<StateT, CustomT>();

    app.use((ctx, next) => {
        ctx.ports = {
            character: connection.manager.getRepository(Character),
            battleSession: connection.manager.getRepository(BattleSession),
        };

        return next();
    });

    app.use(pathCanonicalizer());

    app.use(
        bodyParser({
            enableTypes: ['json'],
        }),
    );

    app.use(serve(path.join(WORKDIR, 'dst')));

    const pug = new Pug({
        viewPath: path.join(WORKDIR, 'template'),
        locals: {
            mountedPath: '/',
        },
    });

    pug.use(app as any);

    app.use(mkRouter(router).routes());

    app.listen(8000);

    console.log('Server running at http://localhost:8000/');

    return;
}

mkApp().catch(e => {
    console.log(e);
});
