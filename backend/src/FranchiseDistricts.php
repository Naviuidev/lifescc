<?php

declare(strict_types=1);

namespace Lifescc;

/**
 * Andhra Pradesh & Telangana district allow-lists for franchise inquiries (server-side validation).
 */
final class FranchiseDistricts
{
    public const STATE_ANDHRA = 'Andhra Pradesh';

    public const STATE_TELANGANA = 'Telangana';

    /** @var list<string> */
    public const STATES = [
        self::STATE_ANDHRA,
        self::STATE_TELANGANA,
    ];

    /** @var array<string, list<string>> */
    private const BY_STATE = [
        self::STATE_ANDHRA => [
            'Alluri Sitharama Raju',
            'Anakapalli',
            'Anantapur',
            'Annamayya',
            'Bapatla',
            'Chittoor',
            'Dr. B.R. Ambedkar Konaseema',
            'East Godavari',
            'Eluru',
            'Guntur',
            'Kakinada',
            'Konaseema',
            'Krishna',
            'Kurnool',
            'Nandyal',
            'NTR',
            'Palnadu',
            'Parvathipuram Manyam',
            'Prakasam',
            'Sri Potti Sriramulu Nellore',
            'Sri Sathya Sai',
            'Tirupati',
            'Visakhapatnam',
            'Vizianagaram',
            'West Godavari',
            'YSR Kadapa',
        ],
        self::STATE_TELANGANA => [
            'Adilabad',
            'Bhadradri Kothagudem',
            'Hanamkonda',
            'Hyderabad',
            'Jagtial',
            'Jangaon',
            'Jayashankar Bhupalpally',
            'Jogulamba Gadwal',
            'Kamareddy',
            'Karimnagar',
            'Khammam',
            'Komaram Bheem Asifabad',
            'Mahabubabad',
            'Mahabubnagar',
            'Mancherial',
            'Medak',
            'Medchal Malkajgiri',
            'Mulugu',
            'Nagarkurnool',
            'Nalgonda',
            'Narayanpet',
            'Nirmal',
            'Nizamabad',
            'Peddapalli',
            'Rajanna Sircilla',
            'Ranga Reddy',
            'Sangareddy',
            'Siddipet',
            'Suryapet',
            'Vikarabad',
            'Wanaparthy',
            'Warangal',
            'Yadadri Bhuvanagiri',
        ],
    ];

    public static function isValidDistrict(string $state, string $district): bool
    {
        $d = trim($district);
        if ($d === '') {
            return false;
        }
        $list = self::BY_STATE[$state] ?? null;
        if ($list === null) {
            return false;
        }

        return in_array($d, $list, true);
    }
}
