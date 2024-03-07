import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import Rooms from '../utils/rooms';

type MyRequest = FastifyRequest<{
    Params: { id: string };
    Querystring: {
        name: string;
        k: string; //secret key
    };
}>;

export default function roomRoutes(
    fastify: FastifyInstance | any,
    opts: FastifyPluginOptions | any,
    done: (err?: Error | undefined) => void
) {
    fastify.post('/:id', (req: MyRequest, reply: FastifyReply) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        reply.send(Rooms.getInstance().new(req.params.id));
    });

    fastify.get('/:id', (req: MyRequest, reply: FastifyReply) => {
        const secretKey = req.query.k;
        const thisRoom = Rooms.getInstance().get(req.params.id);
        if (!thisRoom || thisRoom.getSecretKey() !== secretKey) {
            return reply.redirect('/');
        }
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        reply.view('call', { roomId: req.params.id });
    });

    done();
}
