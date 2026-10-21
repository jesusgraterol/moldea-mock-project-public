import { eveChannel } from 'eve/channels/eve';
import { none } from 'eve/channels/auth';

// Fictional local fixture only. The owned runtime binds strictly to loopback.
// This is Eve's real HTTP protocol, not an external messaging integration.
export default eveChannel({ auth: [none()] });
