import { Link, useParams } from 'react-router-dom';
import {
    useGetSoknadJsonV2,
    useGetVedleggJsonV2,
} from '../../generated/frontend-soknad-controller-v-2/frontend-soknad-controller-v-2';
import { Button, Detail, Heading } from '@navikt/ds-react';
import ReactJson from '@microlink/react-json-view';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import hash from 'object-hash';
import { useMemo } from 'react';
import { format, parseJSON } from 'date-fns';
import { nb } from 'date-fns/locale';

const downloadJson = (data: object, label: string, soknadId: string) => {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digisos-${soknadId}-${label}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const SoknadView = () => {
    const { soknadId } = useParams<{ soknadId: string }>();
    if (!soknadId) throw new Error('Mangler søknad-ID i URL');
    const { data: soknadJson } = useGetSoknadJsonV2(soknadId);
    const { data: vedleggJson } = useGetVedleggJsonV2(soknadId);
    const soknadJsonString = useMemo(
        () => hash({ ...soknadJson, innsendingstidspunkt: undefined }, { encoding: 'hex' }),
        [soknadJson]
    );
    if (!soknadJson || !vedleggJson)
        return (
            <Heading level="1" size={'xlarge'}>
                Laster...
            </Heading>
        );

    return (
        <article className={'space-y-4'}>
            <Link to={'/soknader'}>
                <div className={'flex items-center pb-2'}>
                    <ArrowLeftIcon title="tilbake" fontSize={'1.5rem'} className={'mr-1'} />
                    Tilbake til søknadsoversikt
                </div>
            </Link>
            <Heading level="2" size="xlarge">
                Søknad {soknadId}
            </Heading>
            <section>
                <table className={'w-full table-fixed m-2 [&_th]:w-60 [&_th]:px-1 [&_th]:text-right'}>
                    <tbody>
                        <tr>
                            <th>Innsendingstidspunkt:</th>
                            {soknadJson.innsendingstidspunkt ? (
                                <td>{format(parseJSON(soknadJson.innsendingstidspunkt), 'PPpp', { locale: nb })}</td>
                            ) : (
                                <td>Intet tidspunkt</td>
                            )}
                        </tr>
                        <tr>
                            <th>Checksum soknadJSON:</th>
                            <td>{soknadJsonString}</td>
                        </tr>
                    </tbody>
                </table>
                <Detail>
                    Checksum beregnes minus <code>innsendingstidspunkt</code>
                </Detail>
            </section>
            <section>
                <div className={'flex gap-4 items-center pb-2'}>
                    <Heading level={'3'} size={'medium'}>
                        Søknad JSON
                    </Heading>
                    <Button size={'small'} onClick={() => downloadJson(soknadJson, 'soknad', soknadId)}>
                        Last ned
                    </Button>
                </div>
                <div className={'bg-gray-50 p-4'}>
                    <ReactJson src={soknadJson} />
                </div>
            </section>
            <section>
                <div className={'flex gap-4 items-center pb-2'}>
                    <Heading level={'3'} size={'medium'}>
                        Vedlegg JSON
                    </Heading>
                    <Button size={'small'} onClick={() => downloadJson(vedleggJson, 'vedlegg', soknadId)}>
                        Last ned
                    </Button>
                </div>
                <div className={'bg-gray-50 p-4'}>
                    <ReactJson src={vedleggJson} />
                </div>
            </section>
        </article>
    );
};
