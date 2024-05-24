import json
from django.core.management.base import BaseCommand
from taxSystem.models import PrivateKey

class Command(BaseCommand):
    help = 'Initializes the database with private keys'

    def add_arguments(self, parser):
        parser.add_argument('--file', type=str, help='Path to the JSON file containing private keys')

    def handle(self, *args, **options):
        file_path = options['file']
        if file_path:
            with open(file_path, 'r') as f:
                pks = json.load(f)
        else:
            pks = [
                "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
                "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
                "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
                "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a",
                "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba",
                "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e",
                "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356",
                "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97",
                "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6",
                "0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e01628897",
                "0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82",
                "0xa267530f49f8280200edf313ee7af6b827f2a8bce2897751d06a843f644967b1",
                "0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd",
                "0xc526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aaa",
                "0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61",
                "0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0",
                "0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd",
                "0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0",
                "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e",
                "0xeaa861a9a01391ed3d587d8a5a84ca56ee277629a8b02c22093a419bf240e65d",
                "0xc511b2aa70776d4ff1d376e8537903dae36896132c90b91d52c1dfbae267cd8b",
                "0x224b7eb7449992aac96d631d9677f7bf5888245eef6d6eeda31e62d2f29a83e4",
                "0x4624e0802698b9769f5bdb260a3777fbd4941ad2901f5966b854f953497eec1b",
                "0x375ad145df13ed97f8ca8e27bb21ebf2a3819e9e0a06509a812db377e533def7",
                "0x18743e59419b01d1d846d97ea070b5a3368a3e7f6f0242cf497e1baac6972427",
                "0xe383b226df7c8282489889170b0f68f66af6459261f4833a781acd0804fafe7a",
                "0xf3a6b71b94f5cd909fb2dbb287da47badaa6d8bcdc45d595e2884835d8749001",
                "0x4e249d317253b9641e477aba8dd5d8f1f7cf5250a5acadd1229693e262720a19",
                "0x233c86e887ac435d7f7dc64979d7758d69320906a0d340d2b6518b0fd20aa998"
            ]

        private_keys = [PrivateKey(private_key=pk) for pk in pks]
        PrivateKey.objects.bulk_create(private_keys, ignore_conflicts=True)

        self.stdout.write(self.style.SUCCESS('Database initialized with private keys'))
